<?php

namespace App\Model;

use App\Service\Config;

class Comment
{
    private ?int $id = null;
    private ?int $postId = null;
    private ?string $content = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getPostId(): ?int
    {
        return $this->postId;
    }

    public function setPostId(?int $postId): self
    {
        $this->postId = $postId;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function fill($array): self
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['post_id']) && !$this->getPostId()) {
            $this->setPostId($array['post_id']);
        }
        if (isset($array['content'])) {
            $this->setContent($array['content']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM comment';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $comments = [];
        $commentsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($commentsArray as $postArray) {
            $comments[] = self::fromArray($postArray);
        }

        return $comments;
    }

    public static function fromArray($array): self
    {
        $comment = new self();
        $comment->fill($array);

        return $comment;
    }

    public static function findById($id): ?self
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM comment WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $commentArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $commentArray) {
            return null;
        }
        $comment = self::fromArray($commentArray);

        return $comment;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO comment (post_id, content) VALUES (:post_id, :content)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'post_id' => $this->getPostId(),
                'content' => $this->getContent(),
            ]);


            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE comment SET content = :content WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':content' => $this->getContent(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM comment WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setContent(null);
    }
}