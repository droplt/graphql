import { Migration } from '@mikro-orm/migrations';

export class Migration20210702151337 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "create table `user` (`id` varchar not null, `created_at` datetime not null, `updated_at` datetime not null, `username` varchar not null, `email` varchar not null, `password` varchar not null, `role` text check (`role` in ('admin', 'contributor', 'visitor')) not null, primary key (`id`));"
    );
    this.addSql(
      'create unique index `user_username_unique` on `user` (`username`);'
    );
    this.addSql('create unique index `user_email_unique` on `user` (`email`);');

    this.addSql(
      'create table `torrent` (`id` varchar not null, `created_at` datetime not null, `updated_at` datetime not null, `name` varchar not null, primary key (`id`));'
    );

    this.addSql(
      'create table `torrent_file` (`id` varchar not null, `created_at` datetime not null, `updated_at` datetime not null, primary key (`id`));'
    );

    this.addSql('alter table `torrent` add column `user_id` varchar null;');
    this.addSql(
      'create index `torrent_user_id_index` on `torrent` (`user_id`);'
    );

    this.addSql(
      'alter table `torrent_file` add column `torrent_id` varchar null;'
    );
    this.addSql(
      'create index `torrent_file_torrent_id_index` on `torrent_file` (`torrent_id`);'
    );
  }
}
