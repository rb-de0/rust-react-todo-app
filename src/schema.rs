table! {
    todos (id) {
        id -> Unsigned<Bigint>,
        body -> Text,
        completed -> Bool,
    }
}
