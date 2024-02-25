import { useState, useRef, useEffect } from "react";
import Action from "../Action/Action";
import styles from "./Comment.module.scss";
import { Icon } from "@iconify/react";

const Comment = ({
  handleInsertNode,
  handleEditNode,
  handleDeleteNode,
  comment,
}) => {
  const [input, setInput] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [expand, setExpand] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [editMode]);

  const handleNewComment = () => {
    setExpand(!expand);
    setShowInput(true);
  };

  const onAddComment = () => {
    if (editMode) {
      handleEditNode(comment.id, inputRef?.current?.innerText);
    } else {
      setExpand(true);
      handleInsertNode(comment.id, input);
      setShowInput(false);
      setInput("");
    }

    if (editMode) setEditMode(false);
  };

  const handleDelete = () => {
    handleDeleteNode(comment.id);
  };
  return (
    <>
      <div
        className={
          comment.id === 1 ? styles.inputContainer : styles.commentContainer
        }
      >
        {comment.id === 1 ? (
          <>
            <input
              type="text"
              className={`${styles.inputContainer__input} ${styles.first_input}`}
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's on your mind..."
            />

            <Action
              className={`${styles.reply} ${styles.comment}`}
              type="COMMENT"
              handleClick={onAddComment}
            />
          </>
        ) : (
          <>
            <span
              contentEditable={editMode}
              suppressContentEditableWarning={editMode}
              ref={inputRef}
              style={{ wordWrap: "break-word" }}
            >
              {comment.name}
            </span>

            <div style={{ display: "flex", marginTop: "5px" }}>
              {editMode ? (
                <>
                  <Action
                    className={styles.reply}
                    type="SAVE"
                    handleClick={onAddComment}
                  />
                  <Action
                    className={styles.reply}
                    type="CANCEL"
                    handleClick={() => {
                      if (inputRef.current)
                        inputRef.current.innerText = comment.name;
                      setEditMode(false);
                    }}
                  />
                </>
              ) : (
                <>
                  <Action
                    className={styles.reply}
                    type={
                      <>
                        {expand ? (
                          <Icon icon="bxs:up-arrow" />
                        ) : (
                          <Icon icon="bxs:down-arrow" />
                        )}{" "}
                        REPLY
                      </>
                    }
                    handleClick={handleNewComment}
                  />
                  <Action
                    className={styles.reply}
                    type="EDIT"
                    handleClick={() => {
                      setEditMode(true);
                    }}
                  />
                  <Action
                    className={styles.reply}
                    type="DELETE"
                    handleClick={handleDelete}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div style={{ display: expand ? "block" : "none", paddingLeft: 25 }}>
        {showInput && (
          <div className={styles.inputContainer}>
            <input
              type="text"
              className={styles.inputContainer__input}
              autoFocus
              onChange={(e) => setInput(e.target.value)}
            />
            <Action
              className={styles.reply}
              type="REPLY"
              handleClick={onAddComment}
            />
            <Action
              className={styles.reply}
              type="CANCEL"
              handleClick={() => {
                setShowInput(false);
                if (!comment?.items?.length) setExpand(false);
              }}
            />
          </div>
        )}

        {comment?.items?.map((cmnt) => {
          return (
            <Comment
              key={cmnt.id}
              handleInsertNode={handleInsertNode}
              handleEditNode={handleEditNode}
              handleDeleteNode={handleDeleteNode}
              comment={cmnt}
            />
          );
        })}
      </div>
    </>
  );
};

export default Comment;
