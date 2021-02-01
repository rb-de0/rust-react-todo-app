use diesel::prelude::*;
use crate::models;

pub fn select_todos(conn: &MysqlConnection) -> Result<Vec<models::Todo>, diesel::result::Error> {
    use crate::schema::todos::dsl::*;

    let results = todos
        .load::<models::Todo>(conn)?;

    Ok(results)
}

pub fn insert_new_todo(bd: &str, conn: &MysqlConnection) -> Result<models::NewTodo, diesel::result::Error> {
    use crate::schema::todos::dsl::*;

    let new_todo = models::NewTodo {
        body: bd.to_string()
    };

    diesel::insert_into(todos)
        .values(&new_todo)
        .execute(conn)?;

    

    Ok(new_todo)
}

pub fn edit_todo(todo_id: u64, bd: &str, conn: &MysqlConnection) -> Result<(), diesel::result::Error> {
    use crate::schema::todos::dsl::*;

    diesel::update(todos.find(todo_id))
        .set(body.eq(bd.to_string()))
        .execute(conn)?;

    Ok(())
}


pub fn complete_todo(todo_id: u64, cp: bool, conn: &MysqlConnection) -> Result<(), diesel::result::Error> {
    use crate::schema::todos::dsl::*;

    diesel::update(todos.find(todo_id))
        .set(completed.eq(cp))
        .execute(conn)?;

    Ok(())
}

pub fn delete_todo(todo_id: u64, conn: &MysqlConnection) -> Result<(), diesel::result::Error> {
    use crate::schema::todos::dsl::*;

    diesel::delete(todos.filter(id.eq(todo_id)))
        .execute(conn)?;

    Ok(())
}