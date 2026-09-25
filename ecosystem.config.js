module.exports = {
  apps: [
    {
      name: 'siv-dev',
      script: '/home/z/my-project/node_modules/.bin/next',
      args: 'dev -p 3000',
      cwd: '/home/z/my-project',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        DATABASE_URL: 'file:/home/z/my-project/db/custom.db',
      },
      error_file: '/home/z/my-project/logs/dev-error.log',
      out_file: '/home/z/my-project/logs/dev-out.log',
      log_file: '/home/z/my-project/logs/dev-combined.log',
      time: true,
      max_memory_restart: '1G',
      autorestart: true,
      watch: false,
    },
  ],
};
