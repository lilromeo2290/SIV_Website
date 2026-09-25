module.exports = {
  apps: [
    {
      name: 'siv-crm',
      script: 'server.js',
      cwd: '/home/z/my-project/.next/standalone',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3080,
        HOSTNAME: '0.0.0.0',
        DATABASE_URL: 'file:/home/z/my-project/db/custom.db',
      },
      error_file: '/home/z/my-project/logs/error.log',
      out_file: '/home/z/my-project/logs/out.log',
      log_file: '/home/z/my-project/logs/combined.log',
      time: true,
      max_memory_restart: '500M',
      autorestart: true,
      watch: false,
    },
  ],
};
