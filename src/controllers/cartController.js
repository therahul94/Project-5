const userModel=require("../models/userModel")
const productModel=require("../models/productModel")
const cartModel=require("../models/cartModel")
const vaidation=require("../validators/validation")
const { default: mongoose } = require("mongoose")
// const { find, findOne, create } = require("../models/productModel")


const createCart=async (req, res)=>{
    
    let requestBody=req.body
    let userId=req.params.userId
    if(!mongoose.isValidObjectId(userId)){
        return res.status(400).send({status:false, msg:"user Id is not valid"})
    }

    const validUser=await userModel.findById(userId)
    if(validUser==null){
        return res.status(400).send({status:false,msg:"No such user exist"})
    }
    
    let {cartId,items,productId}=requestBody

    if(cartId){
        try {
            
       
        if(!mongoose.isValidObjectId(cartId)){
            return res.status(400).send({status:false,msg:"Cart id is invalid"})
        }

        const checkCart=await cartModel.findOne({_id:cartId, isDeleted:false})
        if(checkCart===null){
            return res.status(404).send({status:false,msg:"Cart not found"})
        }

        if(items.length==0){
            return res.status(400).send({status:false,msg:"No items provided"})
        }
        let totalPrice=0


        items=JSON.parse(items)
        for(let i=0;i<items.length;i++){

        if(!items[i].productId) return res.status(400).send({status:false, msg:"please provide product Id"})
        
        
        if(!mongoose.isValidObjectId(items[i].productId)){
            return res.status(400).send({status:false,msg:"product Id is invalid"})
        }

        let checkProductId=await productModel.findOne({_id:items[i].productId, isDeleted:false}).select({price:1, _id:0})
        if(checkProductId===null){
            return res.status(400).send({status:false,msg:"product Id is not found"})
        }

       let k= checkProductId.price
       let M= items[i].quantity
        price=Number(k)*Number(M)
        totalPrice=totalPrice+price

    }
    checkCart.totalItems=checkCart.totalItems+Number(items.length)
    checkCart.totalPrice=checkCart.totalPrice+totalPrice
    // totalItems=totalItems+items.length
    // finalPrice=finalPrice+totalPrice
    const checkCartFinal=await cartModel.findOneAndUpdate({_id:cartId},checkCart,{new:true})
    console.log(checkCartFinal)
    res.status(200).send({status:true,msg:"ahdj",data:checkCartFinal})

    }
 catch (err) {
     console.log(err)
         res.status(500).send({err})   
}
 } else{
        try {
            let totalPrice=0;
            let {items}=requestBody
            let data={}
            data.userId=userId
          //  if(!mongoose.isValidObjectId(productId)){
           //     return res.status(400).send({status:false,msg:"product Id is invalid"})
           // }
    
           items=JSON.parse(items)
            for(let i=0;i<items.length;i++){
    
                console.log(items)
                // let cart=JSON.parse(items)
                // console.log(cart)
                
                if(!(items[i].productId)) return res.status(400).send({status:false, msg:"please provide product Id1"})
                
                
                if(!mongoose.isValidObjectId(items[i].productId)){
                    return res.status(400).send({status:false,msg:"product Id is invalid"})
                }
        console.log("hiii")
                const checkProductId=await productModel.findOne({_id:items[i].productId, isDeleted:false}).select({price:1, _id:0})
                if(checkProductId===null){
                    return res.status(400).send({status:false,msg:"product Id is not found"})
                }
        console.log(checkProductId)
                let k= checkProductId.price
                let M= items[i].quantity
                 price=Number(k)*Number(M)
                 totalPrice=totalPrice+price
    
            // let  checkProductId=await findOne({_id:productId, isDeleted:false}).select({price:1, _id:0, __v:0})
            // if(checkProductId===null){
            //     return res.status(400).send({status:false,msg:"product Id is not found"})
            // }
        }
        data.totalItems=items.length
        data.totalPrice=totalPrice
        data.items=items
    
        const finalData= await cartModel.create(data)
        res.status(201).send({status:true, msg:"Cart Successfully Created", data:finalData})
    
    }
            
        catch (error) {
            console.log(error)
            res.status(500).send(error)
        }


}}
module.exports={createCart}