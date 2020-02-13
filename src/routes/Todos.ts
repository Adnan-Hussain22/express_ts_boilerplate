

import { logger } from '@shared';
import { Request, Response, Router, Express, NextFunction } from 'express';
import { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { paramMissingError } from '@shared';
import { ParamsDictionary } from 'express-serve-static-core';
import express from 'express';
import { getAllTodos, addTodo, updateTodo, deleteTodo } from 'src/services/Todos';
import Boom from 'boom';
import { ITodoInsert, ITodoUpdate, ITodoDelete } from 'src/inputs/TodoInputs';
import { InsertValidator, UpdateValidator } from 'src/validators/TodoValidator';


const router = Router();


/**
* @swagger
* /api/todos/all:
*   get:
*     tags:
*       - Todo
*     summary: get all todos
*     description: Returns an array.
*     produces:
*       - application/json
*     responses:
*       200:
*         description: OK
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                    properties:
*                       id:
*                         type: number
*                       item:
*                          type: string
*                          min: 10
*                          max: 255
*                       title:
*                          type: string
*                          max: 25
*                          min: 3
*                       createdAt:
*                          type: string
*                       updatedAt:
*                          type: string  
*             example:
*               data: [{
     "id": 2,
     "title": "Vue",
     "item": "Learn Vue.js",
     "createdAt": "2020-02-05T11:30:34.172Z",
     "updatedAt": "2020-02-05T11:30:34.172Z"
   }]
*       500:
*         $ref: ''
*/

router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let todos = await getAllTodos();
        res.status(OK).json({ data: todos })
    }
    catch (e) {
        next(Boom.badRequest('crashed!!!').output)
    }
});
/**
 * @swagger
 * /api/todos/add:
 *   post:
 *     tags:
 *       - Todo
 *     summary: Add Todo
 *     description: Add a todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                item:
 *                  type: string
 *                  min: 10
 *                  max: 255
 *                title:
 *                  type: string
 *                  max: 25
 *                  min: 3
 *           example:
 *              {
            "title":"work task",
            "item":"abcdefghiklmnop"
                }  
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                id:
 *                  type: number
 *                item:
 *                  type: string
 *                  min: 10
 *                  max: 255
 *                title:
 *                  type: string
 *                  max: 25
 *                  min: 3
 *                createdAt:
 *                  type: string
 *                updatedAt:
 *                  type: string  
 *             example:
 *               "data": {
                    "title": "work task",
                    "item": "abcdefghiklmnop",
                    "id": 3,
                    "createdAt": "2020-02-13T17:13:40.997Z",
                    "updatedAt": "2020-02-13T17:13:40.997Z"
                    }
 *       
 */

router.post('/add', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let payload: ITodoInsert = { ...req.body };
        let { error } = InsertValidator.validate(payload);
        if (!error) {
            let todos = await addTodo(payload.title, payload.item);
            res.status(OK).json({ data: todos })
        } else {
            next(Boom.badRequest(error.message).output);
        }
    }
    catch (e) {
        next(Boom.badImplementation('crashed!!!').output)
    }
});

/**
 * @swagger
 * /api/todos/update:
 *   put:
 *     tags:
 *       - Todo
 *     summary: Update Todo
 *     description: Update a todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                id:
 *                  type: number
 *                item:
 *                  type: string
 *                  min: 10
 *                  max: 255
 *                title:
 *                  type: string
 *                  max: 25
 *                  min: 3
 *           example:
 *              {
 *          "id":3,
            "title":"work task",
            "item":"abcdefghiklmnop"
                }  
 *     responses:
 *       200:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                id:
 *                  type: number
 *                item:
 *                  type: string
 *                  min: 10
 *                  max: 255
 *                title:
 *                  type: string
 *                  max: 25
 *                  min: 3
 *                createdAt:
 *                  type: string
 *                updatedAt:
 *                  type: string 
 *             example:
 *               "data": {
                    "title": "work task",
                    "item": "abcdefghiklmnop",
                    "id": 3,
                    "createdAt": "2020-02-13T17:13:40.997Z",
                    "updatedAt": "2020-02-13T17:13:40.997Z"
                    }
 *       
 */

router.put('/update', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let payload: ITodoUpdate = { ...req.body };
        let { error } = UpdateValidator.validate(payload);
        if (!error) {
            let todos = await updateTodo(payload);
            res.status(OK).json({ data: payload })
        } else {
            next(Boom.badRequest(error.message).output);
        }
    }
    catch (e) {
        next(Boom.badImplementation('crashed!!!').output)
    }
});
/**
 * @swagger
 * /api/todos/delete:
 *   delete:
 *     tags:
 *       - Todo
 *     summary: Delete Todo
 *     description: Delete a todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                id:
 *                  type: number
 *           example:
 *              {
 *          "id":3
                }  
 *     responses:
 *       200:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                message:
 *                  type: string
 *             example:
 *               "data": {
                    "title": "deleted successfully"
                    }
 *       
 */
router.delete('/delete', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let payload: ITodoDelete = { ...req.body };
        let { error } = UpdateValidator.validate(payload);
        if (!error) {
            let todos = await deleteTodo(payload.id);
            res.status(OK).json({ data: { 'message': 'deleted successfully' } })
        } else {
            next(Boom.badRequest(error.message).output);
        }
    }
    catch (e) {
        next(Boom.badImplementation('crashed!!!').output)
    }
})

export default router;
