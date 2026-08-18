import type { NextFunction, Request, Response } from 'express';

import { DetailUserService } from '../../services/user/DetailUserService.js';

class DetailUserController {
  async handle(req: Request, res: Response, next: NextFunction) {
    const user_id = req.user_id;
    const detailUser = new DetailUserService();

    const user = await detailUser.execute(user_id);

    return res.json(user);
  }
}

export { DetailUserController };
