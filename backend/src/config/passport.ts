// backend/src/config/passport.ts
import passport from 'passport';
import {Strategy as GitHubStrategy} from 'passport-github2';
import {Strategy as QQStrategy} from 'passport-qq';
import User from '../models/User';

// 从环境变量中读取后端的公开 URL
let backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';

// 新增：移除末尾可能存在的多余斜杠，确保 URL 格式正确
if (backendUrl.endsWith('/')) {
    backendUrl = backendUrl.slice(0, -1);
}


// GitHub 策略
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            // 这里拼接后就不会有双斜杠了
            callbackURL: `${backendUrl}/api/auth/github/callback`,
            scope: ['user:email'],
        },
        async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
            try {
                const user = await User.findOne({githubId: profile.id});

                if (user) {
                    return done(null, user);
                }

                const newUser = new User({
                    githubId: profile.id,
                    username: profile.username,
                    email: profile.emails?.[0]?.value || `github_${profile.id}@no-email.com`,
                    avatarUrl: profile.photos?.[0]?.value,
                });

                await newUser.save();
                done(null, newUser);

            } catch (error) {
                done(error);
            }
        }));
} else {
    console.warn('[passport] GitHubStrategy skipped: missing GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET');
}


// QQ 策略
if (process.env.QQ_APP_ID && process.env.QQ_APP_KEY) {
    passport.use(new QQStrategy({
            clientID: process.env.QQ_APP_ID!,
            clientSecret: process.env.QQ_APP_KEY!,
            // 这里拼接后也不会有双斜杠了
            callbackURL: `${backendUrl}/api/auth/qq/callback`,
        },
        async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
            try {
                const openid = profile.id;
                const user = await User.findOne({qqId: openid});

                if (user) {
                    return done(null, user);
                }

                const newUser = new User({
                    qqId: openid,
                    username: profile.nickname,
                    email: `${openid}@qq.com`,
                    avatarUrl: profile._json.figureurl_qq_2 || profile._json.figureurl_qq_1,
                });

                await newUser.save();
                done(null, newUser);

            } catch (error) {
                done(error);
            }
        }));
} else {
    console.warn('[passport] QQStrategy skipped: missing QQ_APP_ID / QQ_APP_KEY');
}

// 用于 session 管理的函数
passport.serializeUser((user, done) => {
    done(null, (user as any).id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});