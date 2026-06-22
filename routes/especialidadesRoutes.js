const router=require("express").Router();

const {
    getEspecialidades
}=require("../controllers/especialidadesController");

router.get("/",getEspecialidades);

module.exports=router;