import 'package:flutter/material.dart';

import 'package:two_you_friend/api/user_info/follow.dart';
import 'package:two_you_friend/widgets/user_page/card.dart';
import 'package:two_you_friend/widgets/common/error.dart';
import 'package:two_you_friend/widgets/common/loading.dart';
import 'package:two_you_friend/util/struct/user_info.dart';

/// 用户关注列表
class FollowPageList extends StatefulWidget {
  /// 构造函数
  const FollowPageList();

  @override
  createState() => FollowPageListState();
}

///
class FollowPageListState extends State<FollowPageList> {
  /// 首页推荐贴子列表
  List<StructUserInfo> followList;

  /// 列表事件监听
  ScrollController scrollController = ScrollController();

  /// 是否存在下一页
  bool hasMore;

  /// 页面是否正在加载
  bool isLoading;

  /// 最后一个数据 id
  String lastId;

  /// 是否接口报错
  bool error = false;

  @override
  void initState() {
    super.initState();

    /// 拉取首页接口数据
    setFirstPage();

    /// 监听上滑事件，活动加载更多
    this.scrollController.addListener(() {
      if (!hasMore) {
        return;
      }
      if (!isLoading &&
          scrollController.position.pixels >=
              scrollController.position.maxScrollExtent) {
        isLoading = true;
        loadMoreData();
      }
    });
  }

  @override
  void dispose() {
    super.dispose();
    this.scrollController.dispose();
  }

  /// 加载下一页
  void loadMoreData() {
    ApiUserInfoFollow.getFollowList().then((retInfo) {
      if (retInfo == null || retInfo.ret != 0) {
        return;
      }
      List<StructUserInfo> newList =
          retInfo.data['list'] as List<StructUserInfo>;

      setState(() {
        error = false;
        isLoading = false;
        hasMore = retInfo.hasMore;
        followList.addAll(newList);
      });
    });
  }

  /// 处理刷新操作
  Future onRefresh() {
    return Future.delayed(Duration(seconds: 1), () {
      setFirstPage();
    });
  }

  /// 处理首次拉取和刷新数据获取动作
  void setFirstPage() {
    ApiUserInfoFollow.getFollowList().then((retInfo) {
      if (retInfo == null || retInfo.ret != 0) {
        // 判断返回是否正确
        error = true;
        return;
      }
      setState(() {
        error = false;
        followList = retInfo.data['list'] as List<StructUserInfo>;
        hasMore = retInfo.hasMore;
        isLoading = false;
        lastId = retInfo.lastId;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    if (error) {
      return CommonError(action: this.setFirstPage);
    }
    if (followList == null) {
      return Loading();
    }
    return RefreshIndicator(
      onRefresh: onRefresh, // 调用刷新事件
      child: ListView.separated(
        scrollDirection: Axis.vertical,
        controller: scrollController,
        shrinkWrap: true,
        itemCount: followList.length,
        itemBuilder: (BuildContext context, int position) {
          if (position < this.followList.length) {
            return UserPageCard(userInfo: followList[position]);
          }
          return CommonLoadingButton(loadingState: isLoading, hasMore: hasMore);
        },
        separatorBuilder: (context, index) {
          return Divider(
            height: .5,
            //indent: 75,
            color: Color(0xFFDDDDDD),
          );
        },
      ),
    );
  }
}
