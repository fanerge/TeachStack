悲观锁/乐观锁

### 悲观锁（PressimisticLock）
常见案例：MySQL 的表锁、行锁、Java 的锁
它是以一种预防的姿态在修改数据之前把数据锁住，然后再对数据进行读写，在它释放锁之前任何人都不能对其数据进行操作，直到解锁后，其他人又进行同样的操作。
### 乐观锁（Optimistic Lock）
常见案例：Git
乐观锁是对于数据冲突保持一种乐观态度，操作数据时不会对操作的数据进行加锁（这使得多个任务可以并行的对数据进行操作），只有到数据提交的时候才通过一种机制来验证数据是否存在冲突(一般实现方式是通过加版本号然后进行版本号的对比方式实现)。