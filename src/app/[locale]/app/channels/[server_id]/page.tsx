export default function ServerPage(props: { params: { server_id: string } }) {
  return <div>server id is: {props.params.server_id}</div>;
}
