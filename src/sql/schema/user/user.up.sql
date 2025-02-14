----------------------------
----------- Users ----------
----------------------------

create table users (
    internal_id uuid primary key not null default gen_random_uuid(),
    firstname varchar(32),
    lastname varchar(32) not null,
    email varchar(100) unique,
    password varchar(255),
    is_active boolean default true,
    is_verified boolean default false,
    provider text not null,
    social_id varchar(255),
    created_at timestamp default now(),
    updated_at timestamp,
    deleted_at timestamp
);
create index users_email on users(email);
create index users_provider on users(provider);
create index users_social_id on users(social_id);
create index users_created_at on users(created_at);
create index users_updated_at on users(updated_at);
create index users_deleted_at on users(deleted_at);

----------------------------
----------- Roles ----------
----------------------------

create table roles (
    internal_id uuid primary key not null default gen_random_uuid(),
    role_name text not null,
    created_at timestamp default now(),
    updated_at timestamp,
    deleted_at timestamp
);
create index roles_role_name on roles(role_name);
insert into roles (role_name)
values ('SUPER_ADMIN'),
    ('ADMIN'),
    ('HOTEL_ADMIN'),
    ('HOTEL_MANAGER'),
    ('HOTEL_DEPARTMENT_MANAGER'),
    ('HOTEL_RECEPTIONIST'),
    ('HOTEL_ACCOUNTANT'),
    ('RESTAURANT_CACHIER'),
    ('BAR_CACHIER'),
    ('COFFEE_SHOP_CACHIER'),
    ('USER');

----------------------------
--------- Users Roles ------
----------------------------

create table users_roles_relation (
    user_id uuid not null,
    role_id uuid not null,
    constraint pk_user_role unique (user_id, role_id)
);

alter table users_roles_relation
add constraint fk_users_roles_relation_users foreign key(user_id) references users (internal_id);
alter table users_roles_relation
add constraint fk_users_roles_relation_roles foreign key(role_id) references roles (internal_id);