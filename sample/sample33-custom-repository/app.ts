import "reflect-metadata";
import {ConnectionOptions, createConnection} from "../../src/index";
import {Post} from "./entity/Post";
import {Author} from "./entity/Author";
import {MigrationExecutor} from "../../src/migration/MigrationExecutor";
import {PostRepository} from "./repository/PostRepository";
import {AuthorRepository} from "./repository/AuthorRepository";
import {UserRepository} from "./repository/UserRepository";
import {User} from "./entity/User";

const options: ConnectionOptions = {
    driver: {
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "admin",
        database: "test"
    },
    autoSchemaSync: true,
    logging: {
        logQueries: true,
    },
    entities: [Post, Author, User],
};

createConnection(options).then(async connection => {

    // first type of custom repository

    const author = await connection
        .getCustomRepository(AuthorRepository)
        .createAndSave("Umed", "Khudoiberdiev");

    const loadedAuthor = await connection
        .getCustomRepository(AuthorRepository)
        .findMyAuthor();

    console.log("Author persisted! Loaded author: ", loadedAuthor);

    // second type of custom repository

    const post = connection
        .getCustomRepository(PostRepository)
        .create();

    post.title = "Hello Repositories!";

    await connection
        .manager
        .getCustomRepository(PostRepository)
        .save(post);

    const loadedPost = await connection
        .manager
        .getCustomRepository(PostRepository)
        .findMyPost();

    console.log("Post persisted! Loaded post: ", loadedPost);

    // third type of custom repository

    const userRepository = connection.manager.getCustomRepository(UserRepository);
    await userRepository.createAndSave("Umed", "Khudoiberdiev");
    const loadedUser = await userRepository.findByName("Umed", "Khudoiberdiev");

    console.log("User loaded: ", loadedUser);


}).catch(error => console.log("Error: ", error));
