//const DB_HOST = process.env.DB_HOST || 'database-1.cgujpjkz4fsl.us-west-1.rds.amazonaws.com';


//Servidor de prueba AWS Appix Software 16 de abril 2025
 //const DB_HOST = process.env.DB_HOST ||'database-1.czyiomwau3kc.us-east-1.rds.amazonaws.com';
 //const DB_HOST = process.env.DB_HOST || 'localhost';
 //Servidor AWS CheesePizzaAppix 7 de Diciembre del 2025
 const DB_HOST = process.env.DB_HOST ||'chp-movil-server.csbwzfd0zlqm.us-east-2.rds.amazonaws.com';
 
 const DB_USER = process.env.DB_USER || 'cheesepizzauser';
 const DB_PASSWORD = process.env.DB_PASSWORD || 'cheesepizza2001';
 const DB_NAME = process.env.DB_NAME ||  'chppreciosespecprodpromocdb';
 
 //const URL_SERVER=process.env.URL_SERVER || 'http://ec2-54-144-58-67.compute-1.amazonaws.com/';
  //URL Server AWS 7 de Diciembre del 2025
 //const URL_SERVER=process.env.URL_SERVER || 'http://ec2-3-148-103-201.us-east-2.compute.amazonaws.com';
 const URL_SERVER=process.env.URL_SERVER || 'http://admin.cheesepizza.com.mx';
 const ENABLE_SSL = true; // Cambia a true para habilitar SSL

/*
// Servidor AWS de CHP Móvil 16 de abril 2025
  const DB_HOST = process.env.DB_HOST ||'chp-movil-server.csbwzfd0zlqm.us-east-2.rds.amazonaws.com';
 //const DB_HOST = process.env.DB_HOST || 'localhost';
 const DB_USER = process.env.DB_USER || 'postgres';
 const DB_PASSWORD = process.env.DB_PASSWORD || 'db-chp-movil-2025';
 const DB_NAME = process.env.DB_NAME ||  'chppreciosespecprodpromocdb';
 const URL_SERVER=process.env.URL_SERVER || 'http://ec2-54-153-58-93.us-west-1.compute.amazonaws.com/';
 const ENABLE_SSL = true; // Cambia a true para habilitar SSL
*/
 
 //AWS
 const DB_PORT = process.env.DB_PORT || 5432;

 //MacBook
 //const DB_PORT = process.env.DB_PORT || 5432;

 //Laptop Omen
//const DB_PORT = process.env.DB_PORT || 5436;

//Desktop INEGI
//const DB_PORT = process.env.DB_PORT || 5433;

 module.exports={
    DB_HOST, DB_USER,DB_PASSWORD, DB_NAME,DB_PORT,URL_SERVER,ENABLE_SSL
 }