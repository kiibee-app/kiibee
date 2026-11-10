import { closeDatabase } from 'src/database/db';
import { reconcilePayments } from 'src/modules/payment/services/reconcilePayments.service';

const parseArgs = (argv: string[]) => {
  const orderIds: string[] = [];
  let since: Date | undefined;
  let limit = 200;
  let apply = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--apply') {
      apply = true;
      continue;
    }

    if (arg === '--order') {
      const value = argv[index + 1];
      if (!value) throw new Error('--order requires an order id');
      orderIds.push(...value.split(',').filter(Boolean));
      index += 1;
      continue;
    }

    if (arg.startsWith('--order=')) {
      orderIds.push(...arg.slice('--order='.length).split(',').filter(Boolean));
      continue;
    }

    if (arg === '--since') {
      const value = argv[index + 1];
      if (!value) throw new Error('--since requires an ISO date');
      since = new Date(value);
      index += 1;
      continue;
    }

    if (arg.startsWith('--since=')) {
      since = new Date(arg.slice('--since='.length));
      continue;
    }

    if (arg === '--limit') {
      const value = Number(argv[index + 1]);
      if (!Number.isFinite(value)) throw new Error('--limit requires a number');
      limit = value;
      index += 1;
      continue;
    }

    if (arg.startsWith('--limit=')) {
      limit = Number(arg.slice('--limit='.length));
      continue;
    }
  }

  if (since && Number.isNaN(since.getTime())) {
    throw new Error('--since must be a valid ISO date');
  }

  return { orderIds, since, limit, apply };
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const result = await reconcilePayments(options);

  console.log(
    JSON.stringify(
      {
        mode: options.apply ? 'apply' : 'dry-run',
        ...result,
      },
      null,
      2,
    ),
  );

  if (!options.apply && result.mismatches.length > 0) {
    console.log(
      '\nDry run only. Re-run with --apply after reviewing the mismatches above.',
    );
  }
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDatabase();
  });
