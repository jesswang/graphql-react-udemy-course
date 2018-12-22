import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo'; // allows us to sandwich GraphQL with our component
import { Link } from 'react-router';
import query from '../queries/fetchSongs';

class SongList extends Component {
  onSongDelete(id) {
    // react-apollo gives us the data prop
    // refetch automatically executes the query associated with the component
    // we're using refetch instead of passing the refetchQueries prop to mutate because we have an associated query
    this.props.mutate({ variables: { id } })
      .then(() => this.props.data.refetch());
  }

  renderSongs() {
    return this.props.data.songs.map(({ id, title }) => {
      return (
        <li key={id} className="collection-item">
          <Link to={`/songs/${id}`}>
            {title}
          </Link>
          <i className="material-icons"
            onClick={() => this.onSongDelete(id)}
          >
            delete
          </i>
        </li>
      );
    });
  }

  render() {
    // the loading prop is given to us on props
    if (this.props.data.loading) { return <div>Loading...</div>; }

    return (
      <div>
        <ul className="collection">
          {this.renderSongs()}
        </ul>
        <Link
          to="/songs/new"
          className="btn-floating btn-large red right"
          >
          <i className="material-icons">add</i>
        </Link>
      </div>
    );
  }
}

const mutation = gql`
  mutation DeleteSong($id: ID) {
    deleteSong(id: $id) {
      id
    }
  }
`;

// the graphql function returns a function that is invoked with SongList
// the result of the query becomes accessible to the component's props
export default graphql(mutation)(
  graphql(query)(SongList)
);
