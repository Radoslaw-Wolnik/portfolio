import jwt from 'jsonwebtoken';

class PortfolioAuthService {
  private JWT_SECRET = process.env.JWT_SECRET!;
  private tokenBlacklist: Set<string> = new Set();

  async createDemoToken(projectId: string, username: string, role: string): Promise<string> {
    const token = jwt.sign(
      { 
        projectId, 
        username, 
        role,
        type: 'demo'
      },
      this.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return token;
  }

  async switchUser(oldToken: string, newUsername: string, newRole: string): Promise<string> {
    const oldTokenData = this.verifyDemoToken(oldToken);
    if (!oldTokenData) {
      throw new Error('Invalid token');
    }

    this.tokenBlacklist.add(oldToken);

    return this.createDemoToken(oldTokenData.projectId, newUsername, newRole);
  }

  verifyDemoToken(token: string): any {
    if (this.tokenBlacklist.has(token)) {
      return null;
    }

  verifyDemoToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

export const portfolioAuthService = new PortfolioAuthService();
