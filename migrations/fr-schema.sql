CREATE TABLE IF NOT EXISTS User (
  id int NOT NULL AUTO_INCREMENT,
  email varchar(255) NOT NULL,
  password char(128) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  role int DEFAULT 0 NOT NULL,
  profile_image varchar(100) DEFAULT 'empty-profile' NOT NULL,
  verified tinyint(1) DEFAULT 0 NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY (email)
); 

CREATE TABLE IF NOT EXISTS Recipe (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  cuisine varchar(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  instruction TEXT,
  is_public tinyint(1) NOT NULL,
  user_id int,
  PRIMARY KEY (id),
  CONSTRAINT fk_user 
    FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Ingredient (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Image (
  id int NOT NULL AUTO_INCREMENT,
  image_url varchar(100) NOT NULL,
  recipe_id int,
  PRIMARY KEY (id),
  CONSTRAINT fk_recipe
    FOREIGN KEY (recipe_id) REFERENCES Recipe (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Ingredient_Recipe_Junction (
  ingredient_id int,
  recipe_id int,
  CONSTRAINT pk_ingredient_recipe
    PRIMARY KEY (ingredient_id, recipe_id),
  CONSTRAINT fk_ingredient_junc
    FOREIGN KEY (ingredient_id) REFERENCES Ingredient (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_recipe_junc
    FOREIGN KEY (recipe_id) REFERENCES Recipe (id) ON DELETE CASCADE ON UPDATE CASCADE 
);

CREATE TABLE IF NOT EXISTS Rating (
  recipe_id int,
  user_id int,
  rating int,
  CONSTRAINT pk_rating
    PRIMARY KEY (recipe_id, user_id),
  CONSTRAINT fk_user_rating
    FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_recipe_rating
    FOREIGN KEY (recipe_id) REFERENCES Recipe (id) ON DELETE CASCADE ON UPDATE CASCADE 
);

CREATE TABLE IF NOT EXISTS User_Favorite (
  recipe_id int,
  user_id int,
  CONSTRAINT pk_rating
    PRIMARY KEY (recipe_id, user_id),
  CONSTRAINT fk_user_favorite
    FOREIGN KEY (user_id) REFERENCES User (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_recipe_favorite
    FOREIGN KEY (recipe_id) REFERENCES Recipe (id) ON DELETE CASCADE ON UPDATE CASCADE 
);


