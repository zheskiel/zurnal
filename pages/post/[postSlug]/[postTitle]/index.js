import { useRouter } from "next/router";

const PostContent = (props) => {
    const router = useRouter();
    const { postSlugId, postSlugTitle } = router.query;

    return (
        <>
            Content
        </>
    )
}

export default WithLayout((children) => (props) => (
    <Layout {...props}>{children}</Layout>
))(PostContent);