use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TodoForm {
    pub body: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TodoCompleteForm {
    pub completed: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TodoEditForm {
    pub body: String,
}