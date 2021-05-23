import { Session } from '../session/session';

export class Ticket {
    _id?: String;
    fullname?: String;
    seat_num?: Number;
    session?: Session;
}
