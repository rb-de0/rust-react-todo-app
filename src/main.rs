#[macro_use]
extern crate diesel;

use actix_files::Files;
use actix_web::{get, middleware, post, delete, web, App, Error, HttpResponse, HttpServer};
use actix_cors::Cors;
use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};

type DbPool = r2d2::Pool<ConnectionManager<MysqlConnection>>;

mod models;
mod requests;
mod schema;
mod repository;

#[get("/todos")]
async fn get_todos(
    pool: web::Data<DbPool>
) -> Result<HttpResponse, Error> {

    let conn = pool.get().expect("couldn't get db connection from pool");
    let todos = web::block(move || repository::select_todos(&conn))
        .await
        .map_err(|e| {
            eprintln!("{}", e);
            HttpResponse::InternalServerError().finish()
        })?;

    Ok(HttpResponse::Ok().json(todos))
}

#[post("/todos")]
async fn add_todo(
    pool: web::Data<DbPool>,
    form: web::Json<requests::TodoForm>
) -> Result<HttpResponse, Error> {

    let conn = pool.get().expect("couldn't get db connection from pool");
    let todo = web::block(move || repository::insert_new_todo(&form.body, &conn))
        .await
        .map_err(|e| {
            eprintln!("{}", e);
            HttpResponse::InternalServerError().finish()
        })?;

    Ok(HttpResponse::Ok().json(todo))
}

#[post("/todos/{todo_id}/complete")]
async fn complete_todo(
    pool: web::Data<DbPool>,
    todo_id: web::Path<u64>,
    form: web::Json<requests::TodoCompleteForm>
) -> Result<HttpResponse, Error> {

    let conn = pool.get().expect("couldn't get db connection from pool");
    web::block(move || repository::complete_todo(todo_id.into_inner(), form.completed, &conn))
        .await
        .map_err(|e| {
            eprintln!("{}", e);
            HttpResponse::InternalServerError().finish()
        })?;

    Ok(HttpResponse::Ok().finish())
}

#[post("/todos/{todo_id}")]
async fn edit_todo(
    pool: web::Data<DbPool>,
    todo_id: web::Path<u64>,
    form: web::Json<requests::TodoEditForm>
) -> Result<HttpResponse, Error> {

    let conn = pool.get().expect("couldn't get db connection from pool");
    web::block(move || repository::edit_todo(todo_id.into_inner(), &form.body, &conn))
        .await
        .map_err(|e| {
            eprintln!("{}", e);
            HttpResponse::InternalServerError().finish()
        })?;

    Ok(HttpResponse::Ok().finish())
}

#[delete("/todos/{todo_id}")]
async fn delete_todo(
    pool: web::Data<DbPool>,
    todo_id: web::Path<u64>
) -> Result<HttpResponse, Error> {

    let conn = pool.get().expect("couldn't get db connection from pool");
    web::block(move || repository::delete_todo(todo_id.into_inner(), &conn))
        .await
        .map_err(|e| {
            eprintln!("{}", e);
            HttpResponse::InternalServerError().finish()
        })?;

    Ok(HttpResponse::Ok().finish())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();
    dotenv::dotenv().ok();

    let connspec = std::env::var("DATABASE_URL").expect("DATABASE_URL");
    let manager = ConnectionManager::<MysqlConnection>::new(connspec);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.");

    let bind = "127.0.0.1:8080";

    HttpServer::new(move || {
            let cors = Cors::default()
                .allow_any_origin()
                .allow_any_header()
                .allow_any_method();
            App::new()
                .data(pool.clone())
                .wrap(cors)
                .wrap(middleware::Logger::default())
                .service(
                    web::scope("/api")
                        .service(add_todo)
                        .service(get_todos)
                        .service(edit_todo)
                        .service(complete_todo)
                        .service(delete_todo)
                )
                .service(Files::new("/", "site/public/").index_file("index.html"))
        })
        .bind(&bind)?
        .run()
        .await
}