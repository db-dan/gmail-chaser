function chaseOldConversations() {
  const AWAITING_RESPONSE_LABEL = '[AWAITING RESPONSE]';
  const CHASE_LABEL = '[CHASE]';
  const DAYS_THRESHOLD = 7;

  const now = new Date();
  const cutoffDate = new Date(now.getTime() - DAYS_THRESHOLD * 24 * 60 * 60 * 1000);

  const awaitingLabel = GmailApp.getUserLabelByName(AWAITING_RESPONSE_LABEL);
  const chaseLabel = GmailApp.getUserLabelByName(CHASE_LABEL) || GmailApp.createLabel(CHASE_LABEL);

  if (!awaitingLabel) {
    Logger.log(`Label ${AWAITING_RESPONSE_LABEL} not found.`);
    return;
  }

  const threads = awaitingLabel.getThreads();

  threads.forEach(thread => {
    const lastMessageDate = thread.getMessages().slice(-1)[0].getDate();

    const hasChaseLabel = thread.getLabels().some(label => label.getName() === CHASE_LABEL);

    if (lastMessageDate < cutoffDate && !hasChaseLabel) {
      thread.addLabel(chaseLabel);
      Logger.log(`Labelled thread: ${thread.getFirstMessageSubject()}`);
    }
  });
}
