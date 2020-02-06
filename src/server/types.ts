export interface IChatMessage {
    room: string,
    author: string,
    date: Date,
    message: string
}

export interface IBadge {
    _id: String,
    name: String,
    description: String,
    icon: String
}

export interface IChallenge {
    name: String,
    description: String,
    icon: String,
    points: Number
}

export interface IPublicUser {
    user: string,
    username: string,
    avatar: string,
    points: Number,
    badge: IBadge
    challenges: IChallenge,
    completed_challenges: IChallenge
}