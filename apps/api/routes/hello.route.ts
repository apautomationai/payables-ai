import { Router } from 'express';
import { helloController } from '@/controllers/hello.controller';

export const router = Router();

/**
 * @openapi
 * /hello:
 *   get:
 *     summary: Get a greeting message
 *     description: Returns a greeting message, optionally personalized with a name
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Optional name to include in the greeting
 *     responses:
 *       200:
 *         description: A greeting message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     timestamp:
 *                       type: string
 *       400:
 *         description: Bad request - invalid input
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Internal server error
 */
router.get('/', helloController.getHelloWorld);

router.get('/health', helloController.helthCheck);

export default router;
