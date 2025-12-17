type MetaData = {
    connected: string[];
    createdAt: number;
    duration: number;
    people: number;
    visibility: string;
}


type RoomItem = {
  roomId: string;
  connected: string[];
  createdAt: number;
  duration: number;
  people: number;
  visibility: string;
  ttl?: number;
};