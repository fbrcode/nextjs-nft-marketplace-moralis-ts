// Create a new table called "ActiveItem"
// Add items when they are listed on the marketplace
// Remove them when they are bought or cancelled

// we don't need to import Moralis because it's injected by the server
//import Moralis from "moralis/types";

// afterSave means anytime sometime is saved to a table, we perform some action
Moralis.Cloud.afterSave('ItemListed', async (request) => {
  // every event gets triggered twice, once on unconfirmed, again on confirmed
  const confirmed = request.object.get('confirmed');
  const logger = Moralis.Cloud.getLogger();
  logger.info(`Marketplace | Looking for confirmed Tx: ${confirmed}`);
  if (confirmed) {
    logger.info(`Marketplace | Object: ${request.object}`);
    const ActiveItem = Moralis.Object.extend('ActiveItem'); // create table if not exists

    const query = new Moralis.Query(ActiveItem);
    query.equalTo('marketplaceAddress', request.object.get('address'));
    query.equalTo('nftAddress', request.object.get('nftAddress'));
    query.equalTo('tokenId', request.object.get('tokenId'));
    query.equalTo('seller', request.object.get('seller'));
    const alreadyListed = await query.first();
    if (alreadyListed) {
      logger.info(`Marketplace | Deleting item already listed...`);
      await alreadyListed.destroy();
      logger.info(`Marketplace | Item deleted.`);
    }
    const activeItem = new ActiveItem(); // create a new object
    activeItem.set('marketplaceAddress', request.object.get('address'));
    activeItem.set('nftAddress', request.object.get('nftAddress'));
    activeItem.set('tokenId', request.object.get('tokenId'));
    activeItem.set('price', request.object.get('price'));
    activeItem.set('seller', request.object.get('seller'));
    logger.info(
      `Marketplace | Adding Address: ${request.object.get(
        'address'
      )}. TokenId: ${request.object.get('tokenId')}`
    );
    logger.info('Saving...');
    await activeItem.save();
  }
});

// afterSave means anytime sometime is saved to a table, we perform some action
Moralis.Cloud.afterSave('ItemCancelled', async (request) => {
  // every event gets triggered twice, once on unconfirmed, again on confirmed
  const confirmed = request.object.get('confirmed');
  const logger = Moralis.Cloud.getLogger();
  logger.info(`Marketplace | Looking for confirmed Tx: ${confirmed}`);
  if (confirmed) {
    logger.info(`Marketplace | Object: ${request.object}`);
    const ActiveItem = Moralis.Object.extend('ActiveItem'); // create table if not exists
    const query = new Moralis.Query(ActiveItem);
    query.equalTo('marketplaceAddress', request.object.get('address'));
    query.equalTo('nftAddress', request.object.get('nftAddress'));
    query.equalTo('tokenId', request.object.get('tokenId'));
    logger.info(`Marketplace | Query: ${query}`);
    const canceledItem = await query.first();
    logger.info(`Marketplace | CancelItem: ${canceledItem}`);
    if (canceledItem) {
      logger.info('Marketplace | Canceling item (deleting from active items table)...');
      await canceledItem.destroy();
      logger.info(`Marketplace | Canceled!`);
    } else {
      logger.info(
        `Marketplace | Item not found in active items table with address ${request.object.get(
          'address'
        )} and tokenId ${request.object.get('tokenId')}`
      );
    }
  }
});

// afterSave means anytime sometime is saved to a table, we perform some action
Moralis.Cloud.afterSave('ItemBought', async (request) => {
  // every event gets triggered twice, once on unconfirmed, again on confirmed
  const confirmed = request.object.get('confirmed');
  const logger = Moralis.Cloud.getLogger();
  logger.info(`Marketplace | Looking for confirmed Tx: ${confirmed}`);
  if (confirmed) {
    logger.info(`Marketplace | Object: ${request.object}`);
    const ActiveItem = Moralis.Object.extend('ActiveItem'); // create table if not exists
    const query = new Moralis.Query(ActiveItem);
    query.equalTo('marketplaceAddress', request.object.get('address'));
    query.equalTo('nftAddress', request.object.get('nftAddress'));
    query.equalTo('tokenId', request.object.get('tokenId'));
    logger.info(`Marketplace | Query: ${query}`);
    const boughtItem = await query.first();
    logger.info(`Marketplace | ItemBought: ${boughtItem}`);
    if (boughtItem) {
      logger.info('Marketplace | Deleting item from active items table...');
      await boughtItem.destroy();
      logger.info(`Marketplace | Deleted!`);
    } else {
      logger.info(
        `Marketplace | Item not found in active items table with address ${request.object.get(
          'address'
        )} and tokenId ${request.object.get('tokenId')}`
      );
    }
  }
});
