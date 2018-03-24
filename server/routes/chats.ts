import * as express from 'express'
import Profile from '../models/profile'
import Chat from '../models/chat'
import { SessionType } from '../types/SessionType'
import handleHttpError from '../utils/handleError'
import { ProfileType } from 'server/types/profileType'
import { ChatType } from 'server/types/chatType'

function renderChats (req: express.Request & {session: SessionType}, res: express.Response) {
    req.session.error = null

    if (req.session && req.session.userId) {

        Profile.findOne({ _id: req.session.userId })
            .then((profileResult: ProfileType) => {

                Chat.find({ ownUserId: profileResult._id })
                    .then((chatResults: ChatType[]) => {
                        if (chatResults && chatResults.length) {
                            Promise.all(chatResults.map((chatResult) => {
                                return Profile.findOne({ _id: chatResult.chatWithId })
                                    .then((chatProfileResult: ProfileType) => ({
                                        _id: chatResult._id,
                                        fullName: chatProfileResult.fullName,
                                        profileImageUrl: chatProfileResult.profileImages
                                            && chatProfileResult.profileImages.length
                                            && chatProfileResult.profileImages[0].replace('public', ''),
                                    }))
                                    .catch(error => {
                                        handleHttpError(
                                            req,
                                            res,
                                            500,
                                            '/',
                                            'chats',
                                            'Something went wrong with getting the profile of a chat!',
                                            error
                                        )
                                    })
                            }))
                                .then(openChatsData => {
                                    console.log(openChatsData)
                                    res.status(200).render('chats.ejs', { openChatsData })
                                })
                                .catch(error => {
                                    handleHttpError(
                                        req,
                                        res,
                                        500,
                                        '/',
                                        'chats',
                                        'Something went wrong inside the Promises to get all the users who you chat with!',
                                        error
                                    )
                                })
                        } else {
                            res.render('chats.ejs', { openChatsData: [] })
                        }
                    })
                    .catch(error => {
                        handleHttpError(
                            req,
                            res,
                            500,
                            '/',
                            'chats',
                            'User ID and ownUserId do not match!',
                            error
                        )
                    })

            })
            .catch(error => {
                handleHttpError(
                    req,
                    res,
                    500,
                    '/',
                    'chats',
                    'Invalid Own User ID!',
                    error
                )
            })

    } else {
        handleHttpError(
            req,
            res,
            403,
            '/',
            'chats',
            'You need to be logged in to view your chats!'
        )
    }

    // const openChatsData = [
    //     {
    //         _id: '1',
    //         fullName: 'Henk Sneevliet',
    //         profileImageUrl: '/img/available-traveler.jpg',
    //     },
    //     {
    //         _id: '2',
    //         fullName: 'Henry voor \'t Schut',
    //         profileImageUrl: '/img/available-traveler.jpg',
    //     },
    // ]

    // res.render('chats.ejs', {
    //     openChatsData,
    // })
}

export default renderChats
