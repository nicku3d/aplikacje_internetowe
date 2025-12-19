<?php

namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Comment;
use App\Service\Router;
use App\Service\Templating;

class CommentController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $comments = Comment::findAll();
        $html = $templating->render('comment/index.html.php', [
            'comments' => $comments,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestComment, Templating $templating, Router $router): ?string
    {
        if ($requestComment) {
            $comment = Comment::fromArray($requestComment);
            // @todo missing validation
            $comment->save();

            $path = $router->generatePath('comment-index');
            $router->redirect($path);
            return null;
        } else {
            $comment = new Comment();
        }

        $html = $templating->render('comment/create.html.php', [
            'comment' => $comment,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $id, ?array $requestComment, Templating $templating, Router $router): ?string
    {
        $comment = Comment::findById($id);
        if (! $comment) {
            throw new NotFoundException("Missing post with id $id");
        }

        if ($requestComment) {
            $comment->fill($requestComment);
            // @todo missing validation
            $comment->save();

            $path = $router->generatePath('comment-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('comment/edit.html.php', [
            'comment' => $comment,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $id, Templating $templating, Router $router): ?string
    {
        $comment = Comment::findById($id);
        if (! $comment) {
            throw new NotFoundException("Missing comment with id $id");
        }

        $html = $templating->render('comment/show.html.php', [
            'comment' => $comment,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $id, Router $router): ?string
    {
        $post = Comment::findById($id);
        if (! $post) {
            throw new NotFoundException("Missing comment with id $id");
        }

        $post->delete();
        $path = $router->generatePath('comment-index');
        $router->redirect($path);
        return null;
    }
}