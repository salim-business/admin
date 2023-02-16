module.exports = {
    apps: [
        {
            name: 'CAFE ADMIN',
        },
    ],

    deploy: {
        production: {
            user: 'root',
            host: ['64.227.180.171'],
            ref: 'origin/main',
            repo: 'git@github.com:D-s-Cafe/admin.git',
            path: '/var/www/cafe/admin',
            'post-deploy':
                'npm install && npm run build:release && pm2 serve dist 4040',
            // 'pre-deploy-local': '',
            // 'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
            // 'pre-setup': ''
        },
    },
}
