# Rust + React.js Sample TODO Application

This application is created using React.js + actix-web


## Setup

### Install Crates

```bash
$ cargo install
```

### Create `.env`

```
DATABASE_URL=mysql://user:password@localhost/db_name
```

### DB Setup

```bash
$ diesel setup
$ diesel migiration run
```

### Run

```bash
# cargo run
```