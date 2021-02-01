use serde::{Serialize};
use crate::schema::todos;

#[derive(Debug, Clone, Serialize, Queryable)]
pub struct Todo {
    pub id: u64,
    pub body: String,
    pub completed: bool,
}

#[derive(Debug, Clone, Serialize, Queryable, Insertable)]
#[table_name="todos"]
pub struct NewTodo {
    pub body: String,
}