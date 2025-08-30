import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
import api from "./api";

export const deleteCommentData = async (commentId: string) => {
	try {
		// Send DELETE request to the API
		await api.delete(`${API_URL}/comments/${commentId}`);
	} catch (error) {
		// Handle errors gracefully
		console.error(`Failed to delete comment with ID ${commentId}:`, error);
		throw error; // Optionally rethrow the error to handle it in the caller
	}
};

export const deleteGroupData = async (groupId: string): Promise<void> => {
	try {
		await api.delete(`${API_URL}/groups/${groupId}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error: any) {
		console.error("Error deleting group:", error.message);
		throw new Error(error.response?.data?.detail || "Failed to delete group");
	}
};

export const deletePostData = async (postId: string): Promise<void> => {
	try {
		const token = localStorage.getItem("authToken");
		await api.delete(`${API_URL}/posts/${postId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		});
	} catch (error: any) {
		console.error("Error deleting post:", error.message);
		throw new Error(error.response?.data?.detail || "Failed to delete post");
	}
};

export const deleteGroupPostData = async (
	groupId: string,
	postId: string
): Promise<void> => {
	try {
		await api.delete(
			`${API_URL}/groups/${groupId}/posts/${postId}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	} catch (error: any) {
		console.error(
			`Error deleting post ${postId} from group ${groupId}:`,
			error.message
		);
		throw new Error(
			error.response?.data?.detail || "Failed to delete post from group"
		);
	}
};

export const deleteFitnessTaskData = async (
	username: string,
	taskId: string
): Promise<void> => {
	await api.delete(
		`${API_URL}/fitness/${username}/${taskId}/delete`,
		{
			headers: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
		}
	);
};

export const deleteUser = async (username: string): Promise<void> => {
	try {
		const token = localStorage.getItem("authToken");

		await api.delete(`${API_URL}/users/admin/${username}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			withCredentials: true,
		});
	} catch (error: any) {
		console.error(`Error deleting user ${username}:`, error.message);
		throw new Error(
			error.response?.data?.detail || `Failed to delete user ${username}`
		);
	}
};
