'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Info } from 'lucide-react';
import Link from 'next/link';

export default function ComposeMessagePage() {
  const router = useRouter();
  const [type, setType] = useState('SMS');
  const [recipient, setRecipient] = useState('');
  const [recipientGroup, setRecipientGroup] = useState('individual');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const finalRecipient = recipientGroup === 'individual' ? recipient : recipientGroup;
      const res = await fetch('/crm/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          recipient: finalRecipient,
          recipientGroup: recipientGroup === 'individual' ? null : recipientGroup,
          subject: type === 'Email' ? subject : undefined,
          content,
        }),
      });

      if (!res.ok) throw new Error('Failed to send message');
      setSubmitResult({ success: true, message: 'Message sent successfully!' });
      setTimeout(() => router.push('/crm/messaging'), 1500);
    } catch {
      setSubmitResult({ success: false, message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const placeholderHints = [
    '{ClientName}',
    '{CompanyName}',
    '{ServiceDate}',
    '{EngineerName}',
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href="/crm/messaging">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Compose Message
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Send SMS, WhatsApp, or Email to clients
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Compose Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Message Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Message Type */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="type">Message Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Recipient Group */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="recipientGroup">Send To</Label>
                <Select value={recipientGroup} onValueChange={setRecipientGroup}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual Recipient</SelectItem>
                    <SelectItem value="All">All Clients</SelectItem>
                    <SelectItem value="Corporate">Corporate Clients</SelectItem>
                    <SelectItem value="VIP">VIP Clients</SelectItem>
                    <SelectItem value="Individual">Individual Clients</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Individual Recipient Input */}
              {recipientGroup === 'individual' && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="recipient">Recipient</Label>
                  <Input
                    id="recipient"
                    placeholder="Enter phone number or email address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Subject (Email only) */}
              {type === 'Email' && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Enter email subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder={`Type your message here. You can use placeholders like ${placeholderHints.join(', ')}`}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  required
                  className="resize-y"
                />
              </div>

              {/* Submit */}
              <div className="flex items-center gap-3">
                <Button type="submit" className="gap-2" disabled={isSubmitting}>
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
                <Link href="/crm/messaging">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>

              {submitResult && (
                <div
                  className={`rounded-lg p-3 text-sm ${
                    submitResult.success
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {submitResult.message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Placeholder Hints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Info className="h-4 w-4 text-blue-600" />
                Available Placeholders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {placeholderHints.map((hint) => (
                  <Badge
                    key={hint}
                    variant="secondary"
                    className="cursor-pointer bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => setContent((prev) => prev + hint)}
                  >
                    {hint}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Click a placeholder to insert it into your message. These will be replaced with actual values when sent.
              </p>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Message Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">SMS</span>
                  <span className="font-medium text-slate-700">160 chars</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">WhatsApp</span>
                  <span className="font-medium text-slate-700">4096 chars</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium text-slate-700">No limit</span>
                </div>
              </div>
              <div className="mt-3 border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Current length</span>
                  <span className="font-medium text-slate-700">{content.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
