UPDATE "users" SET "phone" = REGEXP_REPLACE("phone", E'\\s', '', 'g');
