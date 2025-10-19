import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

/**
 * 日志级别
 */
export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
}

/**
 * 日志接口
 */
interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message: string;
  metadata?: Record<string, any>;
  stack?: string;
}

/**
 * 日志管理器
 */
class Logger {
  private logDir: string;
  private maxFileSize: number = 10 * 1024 * 1024; // 10MB
  private maxFiles: number = 5;

  constructor() {
    // Use /tmp in serverless (Vercel) where filesystem is read-only except /tmp
    const defaultDir = path.join(process.cwd(), 'logs');
    const fallbackDir = '/tmp/logs';

    // Try defaultDir first; if creation fails, fall back to /tmp
    try {
      fs.mkdirSync(defaultDir, { recursive: true });
      this.logDir = defaultDir;
    } catch (_) {
      // eslint-disable-next-line no-console
      console.warn('[logger] Cannot write to', defaultDir, '– falling back to', fallbackDir);
      this.logDir = fallbackDir;
      // Ensure fallback exists
      try {
        fs.mkdirSync(this.logDir, { recursive: true });
      } catch (err) {
        // If /tmp also fails, last resort: disable file logging
        // eslint-disable-next-line no-console
        console.error('[logger] Failed to create log directory', this.logDir, err);
        this.logDir = '';
      }
    }
  }

  /**
   * 确保日志目录存在
   */
  private ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * 获取日志文件路径
   */
  private getLogFilePath(level: LogLevel): string {
    const date = new Date().toISOString().split('T')[0];
    return path.join(this.logDir, `${level.toLowerCase()}-${date}.log`);
  }

  /**
   * 写入日志
   */
  private writeLog(entry: LogEntry) {
    if (!this.logDir) {
      return; // file logging disabled
    }

    const filePath = this.getLogFilePath(entry.level);
    const logLine = JSON.stringify(entry) + '\n';

    // 异步写入
    fs.appendFile(filePath, logLine, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to write log:', err);
      }
    });

    // 同时输出到控制台（开发环境）
    if (process.env.NODE_ENV !== 'production') {
      const colorCode = this.getColorCode(entry.level);
      console.log(
        `${colorCode}[${entry.level}] ${entry.timestamp}\x1b[0m`,
        entry.message,
        entry.metadata || ''
      );
    }

    // 检查文件大小并轮转
    this.rotateLogsIfNeeded(filePath);
  }

  /**
   * 获取颜色代码（终端）
   */
  private getColorCode(level: LogLevel): string {
    const colors = {
      [LogLevel.INFO]: '\x1b[36m', // Cyan
      [LogLevel.WARN]: '\x1b[33m', // Yellow
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.DEBUG]: '\x1b[35m', // Magenta
    };
    return colors[level] || '\x1b[0m';
  }

  /**
   * 轮转日志文件
   */
  private rotateLogsIfNeeded(filePath: string) {
    try {
      const stats = fs.statSync(filePath);
      if (stats.size > this.maxFileSize) {
        const timestamp = Date.now();
        const newPath = filePath.replace('.log', `-${timestamp}.log`);
        fs.renameSync(filePath, newPath);

        // 删除旧文件
        this.cleanOldLogs();
      }
    } catch (err) {
      // 文件可能不存在
    }
  }

  /**
   * 清理旧日志
   */
  private cleanOldLogs() {
    try {
      const files = fs.readdirSync(this.logDir);
      const logFiles = files
        .filter(f => f.endsWith('.log'))
        .map(f => ({
          name: f,
          path: path.join(this.logDir, f),
          time: fs.statSync(path.join(this.logDir, f)).mtime.getTime(),
        }))
        .sort((a, b) => b.time - a.time);

      // 保留最新的文件
      if (logFiles.length > this.maxFiles) {
        logFiles.slice(this.maxFiles).forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
    } catch (err) {
      console.error('Failed to clean old logs:', err);
    }
  }

  /**
   * 记录信息日志
   */
  info(message: string, metadata?: Record<string, any>) {
    this.writeLog({
      level: LogLevel.INFO,
      timestamp: new Date().toISOString(),
      message,
      metadata,
    });
  }

  /**
   * 记录警告日志
   */
  warn(message: string, metadata?: Record<string, any>) {
    this.writeLog({
      level: LogLevel.WARN,
      timestamp: new Date().toISOString(),
      message,
      metadata,
    });
  }

  /**
   * 记录错误日志
   */
  error(message: string, error?: Error, metadata?: Record<string, any>) {
    this.writeLog({
      level: LogLevel.ERROR,
      timestamp: new Date().toISOString(),
      message,
      metadata,
      stack: error?.stack,
    });
  }

  /**
   * 记录调试日志
   */
  debug(message: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV !== 'production') {
      this.writeLog({
        level: LogLevel.DEBUG,
        timestamp: new Date().toISOString(),
        message,
        metadata,
      });
    }
  }
}

// 单例
export const logger = new Logger();

/**
 * 请求日志中间件
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // 记录请求
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    userId: (req as any).user?.id,
  });

  // 记录响应
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const msg = `${req.method} ${req.path} - ${res.statusCode}`;
    const meta = { duration: `${duration}ms`, statusCode: res.statusCode };

    if (res.statusCode >= 400) {
      logger.error(msg, undefined, meta);
    } else {
      logger.info(msg, meta);
    }
  });

  next();
};

