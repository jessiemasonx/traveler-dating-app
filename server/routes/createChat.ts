import * as express from 'express'
import * as mongoose from 'mongoose'
import Chat from '../models/chat'
import Profile from '../models/profile'
import { SessionType } from '../types/SessionType'
import { ProfileType } from 'server/types/ProfileType'
import handleHttpError from '../utils/handleError'
import { ChatType } from 'server/types/chatType'

function createChat (req: express.Request & {session: SessionType}, res: express.Response) {
    if (req.session && req.session.userId && req.session.lastMatchId) {

        Profile.findOne({ _id: req.session.lastMatchId })
            .then((chatWithProfile: ProfileType) => {
                const newChat = new Chat({
                    _id: new mongoose.Types.ObjectId(),
                    chatParticipants: [ req.session.userId, chatWithProfile._id ],
                    ownUserId: req.session.userId,
                    chatWithId: chatWithProfile._id,
                    messages: [],
                })

                newChat.save()
                    .then(() => {
                        Chat.findOne({ _id: newChat._id })
                            .then((chatResult: ChatType) => {
                                Promise.all(chatResult.chatParticipants && chatResult.chatParticipants.map((participantId) => {
                                    return Profile.update({ _id: participantId }, { $push: { chats: chatResult._id } })
                                        .catch(error => {
                                            handleHttpError(
                                                req,
                                                res,
                                                500,
                                                '/chats',
                                                'createChat',
                                                `Error while saving profile ${participantId}!`,
                                                error
                                            )
                                        })
                                }))
                                    .then(() => {
                                        res.redirect(`/chat/${chatResult._id}`)
                                    })
                                    .catch(error => {
                                        handleHttpError(
                                            req,
                                            res,
                                            500,
                                            '/chats',
                                            'createChat',
                                            'Error while getting back the saved chat!',
                                            error
                                        )
                                    })
                            })
                            .catch(error => {
                                handleHttpError(
                                    req,
                                    res,
                                    500,
                                    '/chats',
                                    'createChat',
                                    'Error while getting back the saved chat!',
                                    error
                                )
                            })
                    })
                    .catch(error => {
                        handleHttpError(
                            req,
                            res,
                            500,
                            '/chats',
                            'createChat',
                            'Error while saving a new chat',
                            error
                        )
                    })
            })
            .catch(error => {
                handleHttpError(
                    req,
                    res,
                    500,
                    '/chats',
                    'createChat',
                    'Invalid lastMatchId!',
                    error
                )
            })
    } else {
        handleHttpError(
            req,
            res,
            403,
            '/',
            'createChat',
            'You need to be logged in to create a chat!'
        )
    }

    // const chatData = {
    //     chatId: '1',
    //     chatWithName: 'Henk',
    //     chatWithId: '1',
    //     messages: [
    //         {
    //             messageId: '1',
    //             sentByWho: 'me',
    //             sentBy: 'Henk',
    //             messageText: 'Hello there!',
    //         },
    //         {
    //             messageId: '2',
    //             sentByWho: 'them',
    //             sentBy: 'Maikel',
    //             messageText: 'Hello!',
    //         },
    //         {
    //             messageId: '3',
    //             sentByWho: 'me',
    //             sentBy: 'Henk',
    //             messageText: 'Hello thero!',
    //         },
    //         {
    //             messageId: '4',
    //             sentByWho: 'them',
    //             sentBy: 'Maikel',
    //             messageText: 'Hellooo!',
    //         },
    //     ],
    // }
}

export default createChat
