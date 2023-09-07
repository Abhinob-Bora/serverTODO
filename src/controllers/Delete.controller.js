import { validationResult } from "express-validator"
import { jsonGenerate } from "../utils/helpers.js";
import { StatusCode } from "../utils/constants.js";
import User from "../models/User.js";
import Todo from "../models/Todo.js";


export const RemoveTodo = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.json(jsonGenerate(StatusCode.VALIDATION_ERROR,"Todo id is required",error.mapped()))
    }

    try {
        const result =await Todo.findOneAndDelete({
            userId: req.userId,
            _id:req.body.todo_id
        });
        if(result){
            const user = await User.findOneAndUpdate(
                {
                _id:req.userId
                },
                {
                    $pull:{todos:req.body.todo_id}
                }
            )
            return res.json(jsonGenerate(StatusCode.SUCCESS,"Todo deleted successfully",null))
            

    }} catch(error) {
        res.json(jsonGenerate(StatusCode.UNPROCESSABLE_ENTITY,"Something went wrong",null))
    }



}