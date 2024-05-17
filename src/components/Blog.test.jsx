import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Blog from "./Blog";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";






test("renders title", () => {
    const user = {
        name: "Test user",
        username: "Test username",
    };
    const blog = {
        title: "Test title",
        authur: "Test authur",
        url: "Test url",
        likes: 0,
        user: {
            name: "Test user",
            username: "Test username",
        },
    };

    render(<Blog blog={blog} user={user}/>);
    const title = screen.getByText(blog.title);
    expect(title).toBeDefined();
});

test("renders url, likes and user when view button is pressed", () => {
    const user = {
        name: "Test user",
        username: "Test username",
    };
    const blog = {
        title: "Test title",
        authur: "Test authur",
        url: "Test url",
        likes: 0,
        user: {
            name: "Test user",
            username: "Test username",
        },
    };

    render(<Blog blog={blog} user={user}/>);
    const button = screen.getByText("view");
    fireEvent.click(button);

    const url = screen.getByText(blog.url);
    const likes = screen.getByText(/likes\s0/i);
    const username = screen.getByText(blog.user.name);

    expect(url).toHaveTextContent(blog.url);
    expect(likes.textContent).toMatch(/^likes 0/);
    expect(username).toHaveTextContent(blog.user.name);
});

// test("like button is pressed twice and addLike function is called twice", async () => {
   
//     const user = {
//         name: "Test user",
//         username: "Test username",
//     };
//     const blog = {
//         title: "Test title",
//         authur: "Test authur",
//         url: "Test url",
//         likes: 0,
//         user: {
//             name: "Test user",
//             username: "Test username",
//         },
//     };

//     const mockHandler = vi.fn();
//     render(<Blog blog={blog} user={user} addLike={mockHandler} />);
//     const user1 = userEvent.setup();
//     const viewButton = screen.getByText('view');
//     await user1.click(viewButton);
//     const likeButton = screen.getByText('like');
//     await user1.click(likeButton);
//     screen.debug();
//     console.log(mockHandler.mock.calls);
//     await user1.click(likeButton);

//     expect(mockHandler.mock.calls.length).toHaveLength(2);

// });

test("BlogForm calls the event handler it received as props with the right details when a new blog is created", async () => {
    const createBlog = vi.fn();
    const user = {
        name: "Test user",
        username: "Test username",
    };
    const component = render(<BlogForm createBlog={createBlog} user={user} />);
    const user1 = userEvent.setup();
    const title = component.container.querySelector("#title");
    const author = component.container.querySelector("#author");
    const url = component.container.querySelector("#url");
    const createButton = component.container.querySelector("#create-button");

    await user1.type(title, "Test title");
    await user1.type(author, "Test author");
    await user1.type(url, "Test url");
    await user1.click(createButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe("Test title");
    expect(createBlog.mock.calls[0][0].author).toBe("Test author");
    expect(createBlog.mock.calls[0][0].url).toBe("Test url");
    expect(createBlog.mock.calls[0][0].likes).toBe(0);
    expect(createBlog.mock.calls[0][0].user).toBe(user.id);

});