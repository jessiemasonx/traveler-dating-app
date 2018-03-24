import * as express from 'express'
import handleHttpError from '../utils/handleError'
import { SessionType } from '../types/SessionType'

function renderNotFound (
        error: express.Errback,
        req: express.Request & {session: SessionType},
        res: express.Response,
        next: express.NextFunction
) {
    if (error) {
        handleHttpError(
            req,
            res,
            404,
            '/',
            'not_found',
            'An error occured in the Not Found route!',
            error
        )
    }
}

export default renderNotFound
