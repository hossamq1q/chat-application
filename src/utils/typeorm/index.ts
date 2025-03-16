import { User } from './entities/User';
import { Sessions } from './entities/Sessions';
import { Conversation } from './entities/Conversation';
import { Message } from './entities/Message';
import { Group } from './entities/Group';
import { GroupMessage } from './entities/GroupMessage';

const entities = [User, Sessions, Conversation, Message, Group, GroupMessage];

export { User, Sessions, Conversation, Message, Group, GroupMessage };

export default entities;
