// backend/src/config/passport.ts
import passport from 'passport';
import {Strategy as GitHubStrategy} from 'passport-github2';
import {Strategy as QQStrategy} from 'passport-qq';
import User from '../models/User';

// 从环境变量中读取后端的公开 URL，如果不存在则回退到本地地址
const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';

// GitHub 策略
passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: `${backendUrl}/api/auth/github/callback`,
        scope: ['user:email'],
    },
    async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
        try {
            let user = await User.findOne({githubId: profile.id});

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


// QQ 策略
passport.use(new QQStrategy({
        clientID: process.env.QQ_APP_ID!,
        clientSecret: process.env.QQ_APP_KEY!, // 【已修正】确保这里是 clientSecret
        callbackURL: `${backendUrl}/api/auth/qq/callback`,
    },
    async (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) => {
        try {
            const openid = profile.id;
            let user = await User.findOne({qqId: openid});

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