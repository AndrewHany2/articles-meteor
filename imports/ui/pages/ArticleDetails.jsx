import React, { useState } from "react";
import { useEffect } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import swal from "sweetalert";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTracker } from 'meteor/react-meteor-data';
import { Comments } from "../../api/comment/comment";

const ArticleDetails = (article) => {
    const [articleDetails, setArticleDetails] = useState({});
    const [ready, setReady] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);

    let { id } = useParams();

    useEffect(()=>{
        Meteor.call('getArticleDetails', id, (err, data)=>{
            if(err){
                swal('Error', err.reason, 'error')
            }
            setArticleDetails(data);
            setReady(true);
        });
    },[]);

    const { commentsWithUsers, loading } = useTracker(() => {
        if (!id) return { commentsWithUsers: [], loading: true };
        const commentsHandle = Meteor.subscribe('comments', id);
        const loading = !commentsHandle.ready();
        
        const comments = Comments.collection.find({ articleId: id }, { sort: { createdAt: 1 } }).fetch();
        const userIds = comments.map(comment => comment.createdById);
        const users = Meteor.users.find({ _id: { $in: userIds } }, { fields: { profile: 1 } }).fetch();

        const commentsWithUsers = comments.map(comment => {
            const user = users.find(user => user._id === comment.createdById);
            return { ...comment, user };
        });

        return { commentsWithUsers, loading };
    }, [id]);

    const { currentUser } = useTracker(() => ({
        currentUser: Meteor.user() ? Meteor.user()?.profile : '',
    }), []);

    const addComment = (newComment) => {
        setCommentLoading(true);
        Meteor.call('addComment', { text: newComment, articleId: id }, (err, data)=>{
            if(err) swal(err.reason);
            setCommentLoading(false);
        });
    };

    return (<>
                {ready ? <div className="d-flex align-items-center justify-content-center">
                    <Card style={{ width: '70%' }}>
                        <Card.Body>
                            <Card.Title>{articleDetails.title}</Card.Title>
                            <Card.Text>
                                {articleDetails.description}
                            </Card.Text>
                        </Card.Body>
                        <hr></hr>
                        <h6 className="ms-2">Comments</h6>
                        {commentsWithUsers.map((comment) => {
                            return ( <Card style={{ width: '100%' }}>
                            <Card.Body>
                                <Card.Title className="d-flex justify-content-between">
                                    <div>
                                        {comment.user.profile}
                                    </div>
                                    <div>
                                        {comment.createdOn.toLocaleString()}
                                    </div>
                                </Card.Title>
                                <Card.Text>
                                    {comment.text}
                                </Card.Text>
                            </Card.Body>
                         </Card>)
                        })}
                        {currentUser && <>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control as="textarea" rows={3} value={newComment} onChange={(e)=>{
                                    setNewComment(e.target.value)
                                }}/>
                            </Form.Group>
                            <Button onClick={()=>{
                                addComment(newComment);
                            }} disabled={commentLoading}>Add Comment</Button>
                        </>}
                        
                    </Card>
                </div> : <LoadingSpinner></LoadingSpinner>}
            </>
    );
}
export default ArticleDetails;