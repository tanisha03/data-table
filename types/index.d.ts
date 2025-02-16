interface DataRow{
    athlete: string;
    age: number;
    date: Date;
    country: string;
    sport: string
    gold: number;
    silver: number;
    bronze: number;
    total: number
}

interface ConversationPublic {
    name: string;
    id: number;
    messages?: Array<MessagePublic>;
}

interface MessagePublic {
    created_at?: string;
    updated_at?: string;
    content: string;
    role?: string;
    conversation_id?: number;
    id: number;
    message_context: MessageContextPayload;
}

interface MessageContextPayload {
    tabular_data: DataRow[];
}


