module.exports = {
  apps: [
    {
      name: 'siv-crm',
      script: 'server.js',
      cwd: '/home/sivcrm/app/.next/standalone',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3050,
        HOSTNAME: '0.0.0.0',
        DATABASE_URL: 'file:/home/sivcrm/db/crm.db',
      },
      error_file: '/home/sivcrm/logs/error.log',
      out_file: '/home/sivcrm/logs/out.log',
      log_file: '/home/sivcrm/logs/combined.log',
      time: true,
      max_memory_restart: '500M',
      autorestart: true,
      watch: false,
    },
  ],
};
