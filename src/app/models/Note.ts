import { User } from "./user"
import { Class } from "./class"
export interface Note{
    id:number,
    note:number,
    subject:string,
    class:Class,
    professor:User,
    student:User

}
