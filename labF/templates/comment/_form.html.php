<?php
    /** @var $comment ?\App\Model\Comment */
?>

<div class="form-group">
    <label for="subject">Post Id</label>
    <input type="text" id="subject" name="comment[post_id]" value="<?= $comment ? $comment->getPostId() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Content</label>
    <textarea id="content" name="comment[content]"><?= $comment ? $comment->getContent() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
