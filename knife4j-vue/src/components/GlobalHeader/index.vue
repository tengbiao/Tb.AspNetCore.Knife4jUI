<template>
  <div class="header knife4j-header-default" :class="headerClass">
    <a-icon
      class="trigger"
      :type="collapsed ? 'menu-unfold' : 'menu-fold'"
      @click="toggle"
    />
    <a-button
      v-if="serviceOptions && serviceOptions.length > 0"
      type="primary"
      size="small"
      class="group-btn"
      @click="showGroupModal"
    >
      <a-icon type="swap" />
      <span>{{ $t('switchGroupText') }}</span>
    </a-button>

    <div class="right">
      <HeaderSearch
        v-if="settings.enableSearch"
        class="action search"
        :placeholder="$t('searchHolderText')"
        :onSearch="(value) => onSearch(value)"
        :onPressEnter="(value) => onPressEnter(value)"
      />
      <a-dropdown v-if="currentUser.name">
        <a-menu slot="overlay" class="menu">
          <a-menu-item v-if="settings.enableDocumentManage">
            <router-link to="/documentManager/Settings">
              <a-icon type="setting" /> <span v-html="$t('settingText')"></span>
            </router-link>
          </a-menu-item>
          <a-menu-item @click="clearLocalCache">
            <a-icon type="delete" /> <span v-html="$t('cacheText')"></span>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="logout" @click="changeZh">
            <a-icon type="environment" /> 简体中文
          </a-menu-item>
          <a-menu-item key="triggerError" @click="changeEn">
            <a-icon type="environment" /> English
          </a-menu-item>
          <a-menu-item key="langJp" @click="changeJp">
            <a-icon type="environment" /> 日本語
          </a-menu-item>
        </a-menu>
        <span class="action account">
          <span class="name" v-html="$t('langText')"></span>
        </span>
      </a-dropdown>
      <a-spin v-else size="small" style="margin-left: 8px" />
    </div>

    <a-modal
      :title="$t('selectGroupText')"
      :visible="groupModalVisible"
      :footer="null"
      @cancel="closeGroupModal"
      width="400px"
    >
      <a-input-search
        v-model="groupSearchKey"
        :placeholder="$t('searchHolderText')"
        class="group-search"
        allowClear
      />
      <div class="group-list">
        <div
          v-for="item in filteredServiceOptions"
          :key="item.value"
          class="group-item"
          :class="{ 'group-item-active': item.value === defaultServiceOption }"
          @click="selectGroup(item.value)"
        >
          <div class="group-item-content">
            <span class="group-item-title">{{ item.label }}</span>
          </div>
          <a-icon
            v-if="item.value === defaultServiceOption"
            type="check"
            class="group-check-icon"
          />
        </div>
        <div v-if="filteredServiceOptions.length === 0" class="group-empty">
          {{ $t('swaggerModel.nodata') }}
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import HeaderSearch from "../HeaderSearch";
import constant from "@/store/constants";
export default {
  name: "GlobalHeader",
  components: {
    HeaderSearch,
  },
  props: {
    documentTitle: {
      type: String,
      default: "Knife4j接口文档",
    },
    headerClass: {
      type: String,
    },
    currentUser: {
      type: Object,
    },
    collapsed: {
      type: Boolean,
    },
    onCollapse: {
      type: Function,
    },
    onNoticeVisibleChange: {
      type: Function,
    },
    onNoticeClear: {
      type: Function,
    },
    fetchingNotices: {
      type: Boolean,
    },
    notices: {
      type: Array,
    },
    onMenuClick: {
      type: Function,
      default: () => {},
    },
    serviceOptions: {
      type: Array,
      default: () => [],
    },
    defaultServiceOption: {
      type: String,
      default: "",
    },
  },
  computed: {
    settings() {
      return this.$store.state.globals.settings;
    },
    filteredServiceOptions() {
      if (!this.groupSearchKey) {
        return this.serviceOptions || [];
      }
      const key = this.groupSearchKey.toLowerCase();
      return (this.serviceOptions || []).filter(item =>
        item.label.toLowerCase().includes(key)
      );
    },
  },
  data() {
    return {
      groupModalVisible: false,
      groupSearchKey: "",
    };
  },
  methods: {
    changeZh() {
      // 中文
      // console.log(this);
      this.$i18n.locale = "zh-CN";
      this.$store.dispatch("globals/setLang", "zh-CN");
      this.$localStore.setItem(constant.globalI18nCache, "zh-CN");
    },
    changeEn() {
      // 英文
      // console.log(this);
      this.$i18n.locale = "en-US";
      this.$store.dispatch("globals/setLang", "en-US");
      this.$localStore.setItem(constant.globalI18nCache, "en-US");
    },
    changeJp() {
      // 日文
      // console.log(this);
      this.$i18n.locale = "ja-JP";
      this.$store.dispatch("globals/setLang", "ja-JP");
      this.$localStore.setItem(constant.globalI18nCache, "ja-JP");
    },
    handleMenuClick() {
      // console("handleMenuClick");
    },
    jumpSettings() {
      this.$router.push({ path: "/documentManager/Settings" });
    },
    toggle() {
      this.onCollapse(!this.collapsed);
    },
    onSearch(value) {
      if (value == undefined || value == null || value == "") {
        this.$emit("searchClear");
      }
    },
    onPressEnter(value) {
      this.$emit("searchKey", value);
    },
    onItemClick(item, tabProps) {
      // console(item, tabProps);
    },
    clearLocalCache() {
      try {
        this.$localStore.clear();
      } catch (error) {}
      this.$message.info("清除本地缓存成功");
    },
    showGroupModal() {
      this.groupModalVisible = true;
    },
    closeGroupModal() {
      this.groupModalVisible = false;
      this.groupSearchKey = "";
    },
    selectGroup(value) {
      this.$emit("serviceChange", value);
      this.closeGroupModal();
    },
  },
};
</script>

<style lang="less" scoped>
@import "./index.less";

.group-btn {
  margin-left: 16px;
}

.group-search {
  margin-bottom: 12px;
}

.group-list {
  max-height: 400px;
  overflow-y: auto;

  .group-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 12px 16px;
    border-radius: 4px;
    margin-bottom: 8px;
    border: 1px solid #e8e8e8;
    transition: all 0.3s;

    &:hover {
      border-color: #1890ff;
    }

    &:last-child {
      margin-bottom: 0;
    }

    .group-item-content {
      .group-item-title {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }
    }
  }

  .group-item-active {
    background-color: #e6f7ff;
    border-color: #1890ff;

    &:hover {
      background-color: #bae7ff;
    }
  }

  .group-check-icon {
    color: #1890ff;
    font-size: 16px;
  }

  .group-empty {
    text-align: center;
    color: #999;
    padding: 24px 0;
  }
}
</style>
<style lang="less">
.ant-layout {
  min-height: 100vh;
  overflow-x: hidden;
}

.menu {
  .anticon {
    margin-right: 8px;
  }

  .ant-dropdown-menu-item {
    width: 160px;
  }
}
</style>
