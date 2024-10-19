import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import environment from './config/environment';
import logger from './utils/logger.util';

import adminRoutes from './routes/admin.routes';
import authRoutes from './routes/auth.routes';
import healthRoutes from './routes/health.routes';
import userRoutes from './routes/user.routes';
import jobRoutes from './routes/job.routes';
import siteSettingsRoutes from './routes/site-settings.routes';
import blogRoutes from './routes/blog.routes';
import dockerSessionRoutes from './routes/docker-session.routes';
import projectRoutes from './routes/project.routes';
import demoUserRoutes from './routes/demo-user.routes';
import accountRoutes from './routes/account.routes';

import { errorHandler } from './middleware/error.middleware';
import { addRequestId } from './middleware/request-id.middleware';
// import { initializeWebSocketService } from './services/websocket.service';

const app: Express = express();

app.set('trust proxy', true);

app.use(cors({
    origin: environment.app.frontendUrl,
    credentials: true,
}));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use(addRequestId);

app.use(logger.logRequest);

if (environment.app.nodeEnv === 'development') {
    app.use((req: Request, res: Response, next: NextFunction) => {
        logger.debug('Request details', {
            method: req.method,
            url: req.url,
            query: req.query,
            params: req.params,
            headers: req.headers,
        });
        next();
    });
}

// initializeWebSocketService(app); here we should also add websocket for hot updates

const apiRouter = express.Router();

apiRouter.use('/admin', adminRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/health', healthRoutes);
apiRouter.use('/jobs', jobRoutes);
apiRouter.use('/site-settings', siteSettingsRoutes);
apiRouter.use('/blog', blogRoutes);
apiRouter.use('/docker-sessions', dockerSessionRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/demo-users', demoUserRoutes);
apiRouter.use('/account', accountRoutes);

app.use('/api', apiRouter);

app.use((req: Request, res: Response) => {
    logger.warn(`404 Not Found: ${req.method} ${req.url}`, {
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params
    });
    res.status(404).json({ message: 'Not Found' });
});

app.use(errorHandler);

logger.info('Application initialized', {
    nodeEnv: environment.app.nodeEnv,
    port: environment.app.port,
    frontendOrigin: environment.app.frontendUrl
});

export default app;