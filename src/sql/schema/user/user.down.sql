----------------------------
--------- Users Roles ------
----------------------------

alter table users_roles_relation
drop constraint fk_users_roles_relation_users;

alter table users_roles_relation
drop constraint fk_users_roles_relation_roles;

alter table users_roles_relation
drop constraint pk_user_role;

drop table users_roles_relation;

----------------------------
--------- Roles ------------
----------------------------
drop index roles_role_name;
drop table roles;

----------------------------
----------- Users ----------
----------------------------

drop index users_email;
drop index users_created_at;
drop index users_updated_at;
drop index users_deleted_at;
drop table users;