use soroban_sdk::{Env, String, symbol_short};

/// Emit a structured event when a document is anchored
/// This enables off-chain indexing and real-time updates to Layer 3 portals
pub fn emit_document_anchored_event(
    env: &Env,
    project_id: String,
    ipfs_cid: String,
    document_type: String,
    version_index: u32,
) {
    let topics = (
        symbol_short!("doc_anchr"),
        project_id,
    );
    
    let data = (
        ipfs_cid,
        document_type,
        version_index,
        env.ledger().timestamp(),
    );
    
    env.events().publish(topics, data);
}